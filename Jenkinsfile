// path of the template to use
def templatePath = 'https://raw.githubusercontent.com/BitskiCo/demo-dapp/master/templates/demo-dapp.yaml'
// name of the template that will be created
def appName = 'demo-dapp'

pipeline {
    agent {
        node {
            // spin up a node.js slave pod to run this build on
            label 'nodejs'
        }
    }
    options {
        // set a timeout of 20 minutes for this pipeline
        timeout(time: 20, unit: 'MINUTES')
    }
    stages {
        stage('preamble') {
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject() {
                            echo "Using project: ${openshift.project()}"
                        }
                    }
                }
            }
        }
        stage('Checkout'){
            checkout scm
        }
        stage('build') {
            steps {
                sh 'npm install'
                sh 'npm run-script build-kovan'
                sh "oc start-build ${appName} --from-file=dist"
                script {
                    openshift.withCluster() {
                        openshift.withProject() {
                            def builds = openshift.selector("bc", appName).related('builds')
                            builds.untilEach(1) {
                                return (it.object().status.phase == "Complete")
                            }
                        }
                    }
                } // script
            } // steps
        } // stage
        stage('deploy') {
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject() {
                            def rm = openshift.selector("dc", appName).rollout()
                            openshift.selector("dc", appName).related('pods').untilEach(1) {
                                return (it.object().status.phase == "Running")
                            }
                        }
                    }
                } // script
            } // steps
        } // stage
    } // stages
} // pipeline
