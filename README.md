# WordPress pentest tool project with GUI [PROJECT]
### WordPress Brute Force & Username enumeration

Performs multiple brute force and username enumerations tasks in same time. This is a continuation of the [WPCracker](https://github.com/JoniRinta-Kahila/WPCracker) project.

With the Brute Force tool, you can control how aggressive an attack you want to perform, and this affects the attack time required. The tool makes it possible to adjust the number of threads as well as how large password batches each thread is tested at a time. However, too much attack power can cause the victim's server to slow down.

---

The frontend has been implemented with [Electron-React-TypeScript-Webpack-Boilerplate](https://github.com/Devtography/electron-react-typescript-webpack-boilerplate).
This boilerplate currently works on macOS and Windows. If something doesn't 
work, please [file an issue](https://github.com/Devtography/electron-react-typescript-webpack-boilerplate/issues/new).

#### Aim for cross-platform
OS info | Win32 | Win64 | macOS | Linux
------------ | ----- | ----- | ----- | ----- |
Backend | X | X | X | soon |
FrontEnd | X | X | X | soon |
Tested | 0 | X | X | 0 |

### Next steps
##### FronEnd
- [ ] process the exception information sent by the backend.

##### Backend
- [ ] abort the process where the server responds with 400 etc.
- [ ] sending exception information to the frontend.

### Requirements
.NET Core 3.1

### Using

Download repo: 
``` cli
git clone https://github.com/JoniRinta-Kahila/wpcrackergui.git
```

Open project: 
``` cli
cd wpcrackergui
```

Install with package manager: 
``` cli
npm i
```

Build dev:
``` cli 
npm run dev
```

(If backend have changes, build debug version with vs)

Run dev:
``` cli
npm start
```

### Build project for Windows x32 & x64 
1. ```npm run prod```
2. ```npm build:win```

### Build project for MAC
1. ```npm run prod```
2. ```npm build:mac```

## Build project for Linux

### Build for linux with with docker
https://github.com/electron-userland/electron-build-service/issues/9#issuecomment-704069238
https://docs.microsoft.com/en-us/dotnet/core/install/linux-debian

1. open terminal at root of project
  1.1 run command `npm run prod`
  1.2 run command `npm run cleanCore && npm run linuxCoreBuild`
2. start docker
  2.1 run command `docker pull electronuserland/builder` (do this only the first time)
  2.2 run command `docker run --rm -ti -v C:\Work\wpcrackergui\:/project -w /project electronuserland/builder` (correct the project path if needed)
  2.3 run command `npm i -g electron-builder`
  2.4 run command `cd /project`
  2.5 run command `electron-builder build --linux deb tar.xz`
3. after build is ready, you can locate the build files in the wpcrackergui/out directory

<br><br>
## Notice
In this article, "victim" refers to the attacked WordPress site in pentest lab. Attacking a WordPress site for which you do not have permission may be illegal.
# This is for ethical use only :)