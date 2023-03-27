node {
    def app

    stage('Clone repository') {
        checkout scm
    }
    
    stage('Verify .env') {
            sh 'ls'
        if (fileExists('./.env')) {
            sh 'echo found'
        } else {
            sh 'echo Notfound'
            slackSend channel: '#tech-deploy-alert', color: 'danger', message: "${env.JOB_NAME} apresentou falhas em '${env.STAGE_NAME}'.  <${env.BUILD_URL}|Mais detalhes.>", tokenCredentialId: 'tech-deploy-alert'
            error('Could not found .env')
        }
    }

    stage('Build image') {

        try{ 
            app = docker.build("#")
        }
        catch(all){
            slackSend channel: '#tech-deploy-alert', color: 'danger', message: "${env.JOB_NAME} apresentou falhas em '${env.STAGE_NAME}'.  <${env.BUILD_URL}|Mais detalhes.>", tokenCredentialId: 'tech-deploy-alert'
        }
        
    }

    stage('Push image') {
        docker.withRegistry('https://registry.hub.docker.com', 'docker') {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
        } 
        echo "Trying to Push Docker Build to DockerHub"
    }
    stage('Kubernetes Deploy'){
        sshPublisher(publishers: [sshPublisherDesc(configName: 'SSH jenkins.dnc.group', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: 'kubectl rollout restart deployment', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', sourceFiles: '')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])
        slackSend channel: '#tech-deploy-alert', color: 'good', message: " Deploy '${env.JOB_NAME}' Concluído", tokenCredentialId: 'tech-deploy-alert'
    }
}