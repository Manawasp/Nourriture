#!/usr/bin/env bash
# AUTHOR:   manawasp
# MAIL:     clovis.kyndt@gmail.com
# FILE:     test.sh
# ROLE:     TODO (some explanation)
# CREATED:  2014-11-14 08:00:36
# MODIFIED: 2014-11-14 21:57:19

curl -X POST -H "Content-Type: application/json" -d '{"pseudo":"manawasp","password":"SuperMana59","email":"clovss.mna1@gmail.com"}' http://localhost:8080/users
echo ''
