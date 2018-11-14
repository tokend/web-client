FROM node:8

ARG RSA_KEY
ARG BUILD_ENV
WORKDIR /build
COPY . $PWD
RUN true \
 && eval $(ssh-agent -s) \
 && echo "$RSA_KEY" | ssh-add - \
 && mkdir -p ~/.ssh \
 && echo "$RSA_KEY" > ~/.ssh/id_rsa \
 && chmod 600 ~/.ssh/id_rsa \
 && echo "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config \
 && echo "Host gitlab\n\tHostName gitlab.com\n\tIdentityFile ~/.ssh/id_rsa\n\tUser git\n" >> ~/.ssh/config \
 && git config --global url.ssh://git@gitlab.com/.insteadOf https://gitlab.com/ \
 && npm install --progress=false --loglevel=warn \
 && npm run build $BUILD_ENV \
 && rm ~/.ssh/id_rsa \
 && true

FROM nginx:latest
COPY default.conf /etc/nginx/conf.d/
COPY --from=0 /build/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
