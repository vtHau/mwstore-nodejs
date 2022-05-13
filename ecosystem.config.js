module.exports = {
  apps: [
    {
      name: "app-nodejs",
      append_env_to_name: true,
      script: "yarn",
      args: "start",
      instances: 1,
      watch: true,
      autorestart: true,
      max_memory_restart: "1G",
      env: {
        // common env variable
        NODE_ENV: "production",
        PORT: 9000,
      },
      env_production: {
        // khi deploy với option --env production
        NODE_ENV: "production",
        PORT: 9000,
      },
    },
  ],

  // deploy: {
  //   production: {
  //     // user: "chungtran-prod", // user để ssh
  //     // host: "localhost", // IP của server này (theo sơ đồ)
  //     // ref: "origin/master", // branch để pull source
  //     // repo: "git@github.com:chungtran4078/demo-pm2.git", // repo của project
  //     // path: "/var/www/html/demo-pm2", // sẽ deploy vào thư mục này
  //     "post-deploy":
  //       "npm install && pm2 startOrRestart ecosystem.config.js --env production", // cmd để deploy
  //   },
  // },
};
