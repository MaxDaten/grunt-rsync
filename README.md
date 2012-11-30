# grunt-rsync

Copy files to a (remote) machine running an SSH daemon with 'rsync'.

## Getting Started

*`rsync` has to be installed on the local and remote system. `rsync` must be able to connect to the host without password (e.g. public key authentication)*

Install with: `npm install grunt-rsync`

Inside your `grunt.js` file add :

``` javascript
grunt.loadNpmTasks('grunt-rsync');
```

and a task named `rsync` (see Configuration)!

## Configuration

Add a configuration like this:

```javascript
grunt.initConfig({
  ...
  rsync: {
        deploy: {
          src: 'dist/',
          options: {
            host: "example.com",
            port: "1023",
            user: "jdoe",
            path: "~/production"
          }
        }
      },
    ...
});
```

This will transfer the *content* of the `dist` directory (relative to the current directory) to the host directory `~/production` (relative to the user home) on the host `example.com:1023` logged in with `jdoe`.

*Warning: Files on the remote machine will be overridden*

### File option: `files`
- `files`: defines the files and directories to transfer from local to remote machine

### rsync options: `options`

- `host`: the hostname or ip (ip4/ip6). *Default: `localhost`*
- `port`: the port of the ssh server on the host. *Default: `22`*
- `user`: the user name on the remote to log in with.
- `path`: the path from root (defined by the ssh server) to the directory to place the content in.  *Default: `~`*

#### Config Examples

```javascript
rsync: {
  deploy: {
    options: {
      user: 'jdoe',
      host: 'google.com',
      port: 500
    },
    files: 'a/b/c'
  }
}
```

## Release History
  
## License
Copyright (c) 2012 Jan-Philip Loos
Licensed under the MIT license.

## TODO
  - update README.md
  - unit-tests

