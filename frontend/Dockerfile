FROM nginx

RUN rm -rf /usr/share/nginx/html/*

RUN npm run build

COPY build/ /usr/share/nginx/html

EXPOSE 80