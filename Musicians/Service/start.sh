#!/bin/bash
service nginx start
uwsgi --ini uwsgi.ini --socket :5000