# grunt-rsync-2

Copy files to a (remote) machine running an SSH daemon with 'rsync'.

See also: https://github.com/jedrichards/grunt-rsync

## Getting Started

*`rsync` has to be installed on the local and remote system. `rsync` must be able to connect to the host without password (e.g. public key authentication)*

Install with: `npm install grunt-rsync-2`

Inside your `grunt.js` file add :

``` javascript
grunt.loadNpmTasks('grunt-rsync-2');
```

and a task named `rsync` (see Configuration)!

## Configuration

Add a configuration like this:

```javascript
grunt.initConfig({
  ...
  rsync: {
        deploy: {
          files: 'dist/',
          options: {
            host      : "example.com",
            port      : "1023",
            user      : "jdoe",
            remoteBase: "~/production"
          }
        }
      },
    ...
});
```

This will transfer the *content* of the `dist` directory (relative to the current directory) to the host directory `~/production` (relative to the user home) on the host `example.com:1023` logged in with `jdoe`.

*Warning: Files on the remote machine will be overridden*

### File option: `files`
- `files`: defines the files and directories to transfer from local to remote machine. `files` can be an String (supports grunts globbing) or a map of `<String>:<String>` or `<String>:[<String>]`.

#### Examples:

##### Simple file-descriptor:

```javascript
rsync: {
  deploy: {
    files: 'dist/**/*.jpg' // globbing
    ...
  }  
}
```
selects all jpg-images from all directories in dist


##### Mapping single file-descriptor:

```javascript
rsync: {
  deploy: {
    files: {'images/' : 'dist/**/*.jpg'} // map <String>:<String>
    options: {
      ...
      remoteBase: "~/production"
    }
  }  
}
```
selects all jpg-images from all directories in `dist` to remote `~/production/images/`

##### Mapping multiple file-descriptor:

```javascript
rsync: {
  deploy: {
    files: {'images/' : ['dist/images/*.jpg', 'dist/img/*.jpg']} // map <String>:[<String>]
    options: {
      ...
      remoteBase: "~/production"
    }
  }  
}
```
selects all jpg-images from `images` and `img` directories in `dist` to remote `~/production/images/`


### rsync options: `options`

- `host`: the hostname or ip (ip4/ip6). *Default: `localhost`*
- `port`: the port of the ssh server on the host. *Default: `22`*
- `user`: the user name on the remote to log in with.
- `remoteBase`: the path from root (defined by the ssh server) to the directory to place the content in.  *Default: `~`*
- `preserveTimes`: keeps the origin timestamp. *Default: `false`*
- `preservePermissions`: keeps the rights. *Default: `true`*
- `compression`: transfer with compression. *Default: `true`*
- `recursive`: transfer the source directory recursivly *Default: `true`*
- `additionalOptions`: rsync commandline arguments (see `man rsync`) *Default: `''`*

## Release History
- 0.1.2.1 : readded done for async calls (thanks to [bigmomma](https://github.com/bigmomma))
- 0.1.2 : grunt-4.0 support (big thanks to [cmaddalozzo](https://github.com/cmaddalozzo))
- 0.1.1 : initial release to github and npm

## Contribution
- [cmaddalozzo](https://github.com/cmaddalozzo)
- [bigmomma](https://github.com/bigmomma)
  
## License
Copyright (c) 2012 Jan-Philip Loos
Licensed under the MIT license.

## TODO

