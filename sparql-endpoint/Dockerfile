FROM askomics/virtuoso:7.2.5.1

ARG DBA_PASSWORD
ENV DBA_PASSWORD=${DBA_PASSWORD}

ADD scripts /scripts
ADD toLoad /data/toLoad

RUN sh /scripts/setup.sh

ENV PORT 8080
CMD sh /scripts/start.sh
