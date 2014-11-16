#!/usr/bin/env bash
# AUTHOR:   manawasp
# MAIL:     clovis.kyndt@gmail.com
# FILE:     test.sh
# ROLE:     TODO (some explanation)
# CREATED:  2014-11-14 08:00:36
# MODIFIED: 2014-11-15 05:25:15

curl -X POST -H "Content-Type: application/json" -d '{"pseudo":"supermana","password":"SuperMana59","email":"clovss.mna3@gmail.com"}' http://localhost:8080/users
echo ''
