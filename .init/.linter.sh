#!/bin/bash
cd /home/kavia/workspace/code-generation/personal-notes-application-212623-212655/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

