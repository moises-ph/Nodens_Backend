# serve.sh
#!/bin/bash
# run with gunicorn (http://docs.gunicorn.org/en/stable/run.html#gunicorn)
exec gunicorn -b :80 main:app --access-logfile - --log-level debug --timeout 300