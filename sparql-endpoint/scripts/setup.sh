#!/bin/sh
cd /data

# Move clean-logs file
mv /virtuoso/clean-logs.sh /data/clean-logs.sh 2>/dev/null
chmod +x /data/clean-logs.sh
mkdir -p /data/dumps

# Create ini file, and convert env to ini entries
echo "Creating virtuoso.ini file..."
mv /virtuoso/virtuoso.ini /data/virtuoso.ini 2>/dev/null
echo "Converting environment variables to ini file..."
printenv | egrep "^VIRT_" | while read setting
do
  section=`echo "$setting" | egrep -o "^VIRT_[^_]+" | sed 's/^.\{5\}//g'`
  key=`echo "$setting" | egrep -o "_[^_]+=" | sed 's/[_=]//g'`
  value=`echo "$setting" | egrep -o "=.*$" | sed 's/^=//g'`
  echo "Registering $section[$key] to be $value"
  crudini --set /data/virtuoso.ini $section $key $value
done

# Set dba password
touch /sql-query.sql
echo "Updating dba password and sparql update..."
if [ "$DBA_PASSWORD" ]; then echo "user_set_password('dba', '$DBA_PASSWORD');" >> /sql-query.sql ; fi
if [ "$SPARQL_UPDATE" = "true" ]; then echo "GRANT SPARQL_UPDATE to \"SPARQL\";" >> /sql-query.sql ; fi
virtuoso-t +wait && isql-v -U dba -P dba < /virtuoso/dump_nquads_procedure.sql && isql-v -U dba -P dba < /sql-query.sql
kill $(ps ax | egrep '[v]irtuoso-t' | awk '{print $1}')

# Load data from /data/toLoad
if [ -d "toLoad" ] ;
then
    echo "Start data loading from toLoad folder..."
    pwd="dba"
    graph="http://localhost:8890/DAV"
    if [ "$DBA_PASSWORD" ]; then pwd="$DBA_PASSWORD" ; fi
    if [ "$DEFAULT_GRAPH" ]; then graph="$DEFAULT_GRAPH" ; fi
    echo "ld_dir('toLoad', '*', '$graph');" >> /load_data.sql
    echo "rdf_loader_run();" >> /load_data.sql
    echo "exec('checkpoint');" >> /load_data.sql
    echo "WAIT_FOR_CHILDREN; " >> /load_data.sql
    echo "$(cat /load_data.sql)"
    virtuoso-t +wait && isql-v -U dba -P "$pwd" < /load_data.sql
    kill $(ps ax | egrep '[v]irtuoso-t' | awk '{print $1}')
    echo `date +%Y-%m-%dT%H:%M:%S%:z` > .data_loaded
fi

# Setting
if [ ! -f ".enable_cors" ];
then
  pwd="dba"
  if [ "$DBA_PASSWORD" ]; then pwd="$DBA_PASSWORD" ; fi
  virtuoso-t +wait && isql-v -U dba -P "$pwd" < /scripts/setup.sql
  kill "$(ps aux | grep '[v]irtuoso-t' | awk '{print $1}')"
  echo "`date +%Y-%m-%dT%H:%M:%S%:z`" >  .enable_cors
fi
