#!/bin/bash
pt=$(which python3)

env=$(find . -wholename "./pyenv")

if [[ -z "$env" ]]; then

	if [[ -z "$pt" ]]; then
		echo "No python3 installed"
	else
		sudo apt install python3-pip python3-venv
		python3 -m venv pyenv
		source pyenv/bin/activate && pip3 install -r requirements-linux.txt
	fi
else
	source pyenv/bin/activate
fi
