#!/usr/bin/env bash
service nginx start -c etc/nginx/nginx.conf
uwsgi --ini uwsgi.ini --socket :5000