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
Backend | X | X | soon | soon |
FrontEnd | X | X | X | soon |
Tested | 0 | X | 0 | 0 |

### Next steps
##### FronEnd
- [ ] if necessary, send the process cancellation token to backend.
- [ ] process the exception information sent by the backend.

##### Backend
- [ ] task cancellations.
- [ ] abort the process where the server responds with 400 etc.
- [ ] sending exception information to the frontend.

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

<br><br>
## Notice
In this article, "victim" refers to the attacked WordPress site in pentest lab. Attacking a WordPress site for which you do not have permission may be illegal.
# This is for ethical use only :)