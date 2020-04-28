FROM 340910543935.dkr.ecr.ap-southeast-1.amazonaws.com/node:12.13.0-buster-slim

WORKDIR /tmp

RUN apt-get update && apt-get -y upgrade && apt-get -y dist-upgrade && apt-get install -y alien libaio1

ADD ./oracle-instantclient12.1-basic-12.1.0.2.0-1.x86_64.rpm .
RUN alien -i --scripts oracle-instantclient12.1-basic-12.1.0.2.0-1.x86_64.rpm
RUN sh -c "echo /usr/lib/oracle/12.1/client64/lib > \
      /etc/ld.so.conf.d/oracle-instantclient.conf"
RUN ldconfig
RUN mkdir -p /usr/lib/oracle/12.1/client64/lib/network/admin

RUN rm -f oracle-instantclient12.1-basic-12.1.0.2.0-1.x86_64.rpm && apt-get -y autoremove && apt-get -y clean

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install 
COPY . .
RUN rm -f oracle-instantclient12.1-basic-12.1.0.2.0-1.x86_64.rpm
EXPOSE 3000
CMD npm start