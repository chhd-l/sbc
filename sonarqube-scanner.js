const scanner = require('sonarqube-scanner');
scanner(
    {
          serverUrl: "http://52.151.208.195",
        //   login:"admin",
        //   password:"Qweruiop@123",
        options: {
            "sonar.host.url": "http://52.151.208.195",
            "sonar.sources": "./src",
            "sonar.projectKey": "fgs-storepotal",
            "sonar.login": "0cbf21e13487b376495649489dffd0cfd74ac046"
        },
    },
    () => process.exit()
);