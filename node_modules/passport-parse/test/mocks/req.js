module.exports = {
    empty: {
        body: {

        },
        query:{

        }
    },
    good: {
        body: {
            username: "good",
            password: "good"
        },
        query:{

        }
    },
    bad: {
        body: {
            username: "bad",
            password: "bad"
        },
        query:{

        }
    },
    malformed:{

    },
    notStrings:{
        body:{
            username: {},
            password: {}
        }
    },
    custom: {
        body:{
            un:"good",
            pw:"good"
        }
    }
};