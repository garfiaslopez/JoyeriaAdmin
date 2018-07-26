module.exports = {
    servers: {
        one: {
            host: '104.236.46.13',
            username: 'root',
            password: 'silvia.92864'
        }
    },
    meteor: {
        name: 'joyeriasilvia',
        path: './',
        servers: {
            one: {}
        },
        buildOptions: {
            serverOnly: true,
            cleanAfterBuild: true
        },
        env: {
            ROOT_URL: 'http://104.236.46.13',
            MONGO_URL: 'mongodb://localhost:27017/joyeriasilvia'
        },
        docker: {
            //image: 'abernix/meteord:base',
            image: 'kadirahq/meteord',
            args:[
                "--memory-reservation 400M"
            ]
        },
        deployCheckWaitTime: 60,
        enableUploadProgressBar: true
    },
    mongo: {
        oplog: true,
        port: 27017,
        servers: {
            one: {},
        },
    }
};
