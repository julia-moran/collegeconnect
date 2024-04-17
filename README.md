# College Connect

# Designed by: Julia Moran, Jerome Serrao, Jack Hamilton, and Thomas Kasper

# About:

- **College Connect is a course-based group chat application for college students.**
- **This app was primarily developed using Intel-based machines running Windows 11, and the installation/running guides are written for those environmental specifications.**

# Dependencies:

- **Node.js**
  - **Socket.io**
  - **Express.js**
  - **jQuery**
- **PostgreSQL**
- **Docker Desktop**
- **Cloudflare Services (cloudflared)**
- **Bootstrap**
- **GitHub via browser**

# Dependency Installations for Local Development:

**Accessing GitHub via Browser**
    1. Navigate to the GitHub.com website and either create an account or login with an existing one.
    2. Confirm account and configure GitHub settings where applicable.

**Installing Node.js**
    1. The Node.js runtime installer can be downloaded from their website via browser: https://nodejs.org/en/download
        - Windows installers of many versions and requirements are present on the above page.
    2. After download, run and follow the instructions provided by the installer and restart machine.

**Installing Socket.io**
    - Socket.io is installed via the npm software registry (installed during Node.js installation).

    `npm install socket.io`

**Installing Express.js**
    - Express.js is installed via the npm software registry (installed during Node.js installation).

    `npm install express`

**Installing jQuery**
    - jQuery is installed via the npm software registry (installed during Node.js installation).

    `npm install jquery`

**Installing PostgreSQL**
    - PostgreSQL is installed via the npm software registry (installed during Node.js installation).

    `npm install pg`

**Installing Docker Desktop**
    1. The Docker Desktop installer can be downloaded from their website via browser: https://docs.docker.com/desktop/install/windows-install/
        - 'Docker Desktop for Windows' has a large blue button at the top of the above page.
    2. After download, run and follow the instructions provided by the installer and restart the machine.
    3. Open the Docker Desktop application and configure performance and storage settings to the machine being developed on (memory limits, CPU limits, etc.).

**Installing Cloudflare Services (cloudflared)**
    1. The Cloudflare Services connector, cloudflared, can be downloaded from their website via browser: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
        - A Windows x32 and x64 installer can be downloaded directly from the center of the above page in the 'Windows - Executable' section.
    2. After download, run and follow the instructions provided by the installer and restart machine.
    3. Open Terminal, PowerShell, or another Windows CLI editor and navigate to the '.cloudflared' directory where the service was installed.
    4. Enter the following command to be redirected to the Cloudflare website for account authentication:

    `cloudflared tunnel login`

    5. Login with Cloudflare credentials to create a certificate in the '.cloudflared' directory and a permanent link between the machine and account services within the Cloudflare infrastructure.
        - If your web services have not already been migrated to Cloudflare, follow this tutorial to make Cloudflare services available for your domain: https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/

**Installing Bootstrap**
    1. The Bootstrap installer can be downloaded from their website via browser: https://getbootstrap.com/docs/3.4/getting-started/
        - A Windows installer is available using the 'Download Bootstrap' button on the above page.
    2. After download, run and follow the instructions provided by the installer and restart machine.

# Running the Application:

**Pull Repository from GitHub via Browser Download**
    1. Use this link to access the 'collegeconnect' repository created by user 'julia-moran': https://github.com/julia-moran/collegeconnect
    2. Download the code contained within the repository to the machine.

**Start a Docker Multi-Container Instance via CLI**
    1. Start the Docker Desktop application to begin running the Docker Engine for WSL containerization.
    2. Open Terminal, PowerShell, or another Windows CLI editor and navigate to the 'build' directory in the 'collegeconnect' repository.
    3.

**Start a Local cloudflared Tunnel via CLI**
    1. Open Terminal, PowerShell, or another Windows CLI editor and navigate to the '.cloudflared' directory where the service was installed.
    2. Enter the following command to create a cloudflared tunnel with the name 'collegeconnect':

    `cloudflared tunnel create collegeconnect`

    3. Copy the tunnel UUID (a long string printed at the end after tunnel creation confirmation, such as: 80243281-32f2-42d8-9371-e96acff82816) outputted to the console after tunnel creation to the clipboard.
    4. Create a file (if it does not already exist) in the '.cloudflared' directory called`config.yml`.
        - This file will hold the configuration settings that Cloudflare will read when running a tunnel:

    **url**: The port you wish to mirror from your local machine.
            - College Connect utilizes localhost:3000 by default for app hosting.
        **tunnel**: The tunnel UUID copied from the newly created 'collegeconnect' tunnel.
        **credentials-file**: The *FULL FILEPATH* to the newly created '`<UUID>`.json' file in the local '.cloudflared' directory.

`config.yml`
    `url: http://localhost:<port>`
    `tunnel: <UUID>`
    `credentials-file: full\path\to\.cloudflared\<UUID>.json`

**Navigate to Live Application via Browser**

# Resources:
