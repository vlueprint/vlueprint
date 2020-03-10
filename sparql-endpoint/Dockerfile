FROM askomics/virtuoso:7.2.5.1

ENV PORT 8080
ENV VIRT_HTTPServer_ServerPort=${PORT}

ADD scripts /scripts
ADD toLoad /data/toLoad

RUN sh /scripts/setup.sh

CMD sh /scripts/start.sh
