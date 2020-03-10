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

virtuoso-t +wait +foreground