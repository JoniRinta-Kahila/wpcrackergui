# WordPress pentest tool project with GUI
### WordPress Brute Force & Username enumeration

Performs multiple brute force and username enumerations tasks in same time. This is a continuation of the [WPCracker](https://github.com/JoniRinta-Kahila/WPCracker) project.

With the Brute Force tool, you can control how aggressive an attack you want to perform, and this affects the attack time required. The tool makes it possible to adjust the number of threads as well as how large password batches each thread is tested at a time. However, too much attack power can cause the victim's server to slow down.

---

#### Aim for cross-platform
OS info | Win32 | Win64 | macOS | Linux
------------ | ----- | ----- | ----- | ----- |
Backend | X | X | X | X |
FrontEnd | X | X | X | X |
Tested | 0 | X | X | deb11 |

### TODO
- FronEnd
    - [ ] process the exception information sent by the backend.
- Backend
    - [ ] abort the process where the server responds with 400 etc.
    - [ ] sending exception information to the frontend.

### Requirements
.NET Core 3.1

### Using

- Download repository:
    - `git clone https://github.com/JoniRinta-Kahila/wpcrackergui.git`
- Open project:
    - `cd wpcrackergui`
- Install with package manager:
    - `npm i`
- Build dev version:
    - `npm run dev`
- build produciton version:
    - `npm run prod`
- Run current version:
    - `npm run start`
- If the backend is not builded or has changed:
    - `npm run winCoreBuild`
    - `npm run macCoreBuild`
    - `npm run linuxCoreBuild`

### Build project for Windows x32 & x64 
1. ```npm run prod```
2. ```npm run build:win```

### Build project for MAC
1. ```npm run prod```
2. ```npm run build:mac```

#### After build is ready, you can locate the build files in the wpcrackergui/out directory

## Build project for Linux

### Build for linux with with docker

- *tested in Debian 11*

https://github.com/electron-userland/electron-build-service/issues/9#issuecomment-704069238

https://docs.microsoft.com/en-us/dotnet/core/install/linux-debian

1. Open terminal at root of project
    1. run command `npm run prod`
    2. run command `npm run cleanCore && npm run linuxCoreBuild`
2. Start docker
    1. run command `docker pull electronuserland/builder` (do this only the first time)
    2. run command `docker run --rm -ti -v C:\Work\wpcrackergui\:/project -w /project electronuserland/builder` (correct the project path if needed)
    3. run command `npm i -g electron-builder`
    4. run command `cd /project`
    5. run command `electron-builder build --linux deb tar.xz`
3. After build is ready, you can locate the build files in the wpcrackergui/out directory

<br><br>
## Notice
In this article, "victim" refers to the attacked WordPress site in pentest lab. Attacking a WordPress site for which you do not have permission may be illegal.
# This is for ethical use only :)
