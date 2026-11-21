FROM nginx:alpine

COPY index.html style.css /usr/share/nginx/html/
COPY js/ /usr/share/nginx/html/js/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]