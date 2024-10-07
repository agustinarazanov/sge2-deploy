node {
    def app

    stage('Clone repository') {
        checkout scm
    }

    stage('Build image') {
        app = docker.build("tst/sge2")
    }

    stage('Push image to registry') {
        docker.withRegistry('https://registry.frba.utn.edu.ar', 'registry-gitlab') {
            app.push("latest")
        }
    }

    stage('Update images en la MV') {
  	    sh 'eval $(docker-machine env NOMBRE_DE_LA_VM) && docker compose pull app'
    }

    stage('Deploy TST container') {
       sh 'eval $(docker-machine env NOMBRE_DE_LA_VM) && docker-compose up -d --force-recreate --no-deps app'
    }
}
