FROM ubuntu:20.04

#Ports
EXPOSE 8080

#Download static file serve
RUN apt-get -y update
RUN apt-get -y install curl sudo
RUN curl --proto '=https' --tlsv1.2 -sSfL https://get.static-web-server.net | sh

#Add rootless user
RUN useradd -U rootless

# Rootless user
USER rootless
WORKDIR /usr/rootless
# Copy files
COPY --chown=rootless:rootless ./dist /usr/rootless/dist 

#Command
CMD [ "static-web-server","--page-fallback","index.html","--page404","index.html", "-p","8080", "-d","dist/marvel-comics/browser" ]