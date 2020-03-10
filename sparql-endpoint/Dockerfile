FROM askomics/virtuoso:7.2.5.1

ADD scripts /scripts
ADD toLoad /data/toLoad

RUN sh /scripts/setup.sh

ENV PORT 8890

CMD virtuoso-t +wait +foreground
