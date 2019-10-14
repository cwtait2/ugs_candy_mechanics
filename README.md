# UgsCandyMechanics

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.3.

## Installation
Copy and paste this script to a terminal to download and install a new version of the frontend and backend:
```bash
# Install required software
sudo apt update
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
sudo apt install -y nodejs nginx openjdk-8-jdk

# Configure web server with reverse proxy
sudo bash -c 'cat << EOF > /etc/nginx/sites-enabled/default
server {
        listen 80 default_server;
        listen [::]:80 default_server;
        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;
        server_name _;
        location / {
                try_files \$uri\$args \$uri\$args/ /index.html;
        }

        location /api {
                proxy_pass http://127.0.0.1:8080;
        }
}
EOF'
sudo service nginx restart

# Download the web application source
cd ~
rm ugs_candy_mechanics-master.zip
rm -rf ugs_candy_mechanics-master
wget -O ugs_candy_mechanics-master.zip "https://github.com/breiler/ugs_candy_mechanics/archive/master.zip"
unzip -e ugs_candy_mechanics-master.zip

# Compile and install web application
cd ~/ugs_candy_mechanics-master
npm install
npx ng build
sudo rm -rf /var/www/html/*
sudo cp -r dist/ugs-candy-mechanics/* /var/www/html/

# Download and install UGS backend
cd ~
rm UniversalGcodeSender.zip
rm -r UniversalGcodeSender
wget -O UniversalGcodeSender.zip "https://ugs.jfrog.io/ugs/UGS/nightly/UniversalGcodeSender.zip"
unzip -e UniversalGcodeSender.zip -d UniversalGcodeSender
cd ~/UniversalGcodeSender
chmod +x start-cli.sh

# Setup UGS autostart
sudo bash -c 'cat << EOF > /lib/systemd/system/ugs.service
[Unit]
Description=Start UGS
After=multi-user.target

[Service]
User=pi
Group=pi
ExecStart=/home/pi/UniversalGcodeSender/start-cli.sh -d -w /home/pi/workspace

[Install]
WantedBy=multi-user.target
EOF'

# Install and restart UGS service
sudo systemctl daemon-reload
sudo systemctl enable ugs.service
sudo service ugs restart

```


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
