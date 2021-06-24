// 定义参数label，K8S启动的pod名称通过这个来制定
def label = "JenkinsPOD-${UUID.randomUUID().toString()}"

// 定义jenkins的工作目录
def jenworkspace="/home/jenkins/workspace/${APP_NAME}"

//kubectl和docker执行文件，这个可以打到镜像里面，这边直接共享的方式提供
def sharefile="/home/jenkins/sharefile"

// deployment等K8S的yaml文件目录
def k8srepo='/home/jenkins/k8s_repos'


// cloud为我们前面提供的云名称，nodeSelector是K8S运行pod的节点选择
podTemplate(label: label, cloud: 'kubernetes',
    containers: [
        containerTemplate(
            name: 'jnlp',
            image: 'k8sregistrysit.azurecr.io/repository:393',
            ttyEnabled: true,
            alwaysPullImage: true,
            resourceRequestCpu: '500m',
            resourceRequestMemory: '800Mi'
            )
    ],
    //volumes: [
    //    hostPathVolume(hostPath: '/var/run/docker.sock', mountPath:'/var/run/docker.sock')
    //        ],
    envVars: [ 
<<<<<<< HEAD
          envVar(key: 'DOCKER_HOST',value: 'tcp://40.117.189.42:2375')
=======
          envVar(key: 'DOCKER_HOST',value: 'tcp://40.85.188.69:2375')
>>>>>>> origin/release
    ],
    imagePullSecrets: [ 'sit-docker' ]
)
{
    node (label) {
        
        stage('Git Pull'){
              dir("$jenworkspace"){
                 git branch: "${GIT_BRANCH}", changelog: false, credentialsId: "${GIT_CREADENTIAL}", poll: false, url: "${GIT_URL}"
            }
        }

        stage('npm package'){
                dir("$jenworkspace"){
                    sh "node --version"
                    sh "npm --version"
                    sh "npm install"
                    sh "npm run build"
                }
        }

        stage('Docker build'){
            dir("$jenworkspace"){
                // 创建 Dockerfile 文件，但只能在方法块内使用
                docker1 = readFile encoding: "UTF-8", file: "./Dockerfile"
                //dockerfile = docker1.replaceAll("#APP_OPTS","${APP_OPTS}")
                //                        .replaceAll("#APP_NAME","${APP_NAME}")
                dockerfile = docker1.replaceAll("#APP_NAME","${APP_NAME}")
                writeFile encoding: 'UTF-8', file: './Dockerfile', text: "${dockerfile}"


                // 设置 Docker 镜像名称
                dockerImageName = "${REGISTRY_URL}/${DOCKER_HUB_GROUP}/${APP_NAME}:${APP_VERSION}"
                sh "cat Dockerfile"
                if ("${DOCKER_HUB_GROUP}" == '') {
                    dockerImageName = "${REGISTRY_URL}/${APP_NAME}:${APP_VERSION}"
                }

                // 提供 Docker 环境，使用 Docker 工具来进行 Docker 镜像构建与推送
                docker.withRegistry("http://${REGISTRY_URL}", "${REGISTRY_CREADENTIAL}") {
                    def customImage = docker.build("${dockerImageName}")
                    customImage.push()
                }
            }
        }

        stage('K8S Deploy'){
                    // 使用 Kubectl Cli 插件的方法，提供 Kubernetes 环境，在其方法块内部能够执行 kubectl 命令
                    withKubeConfig([credentialsId: "${KUBERNETES_CREADENTIAL}",serverUrl: "${KUBERNETES_URL}"]) {
                   
                    sh "kubectl set image deployment ${APP_NAME} *=${dockerImageName} -n ${PROJECT_ENV}"
                }
        }
        
    }
}