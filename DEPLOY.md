# Deploy DevOps AI Tool on Local Kubernetes (Docker Desktop + ArgoCD)

## Prerequisites
- Docker Desktop with Kubernetes enabled
- kubectl configured to use docker-desktop context
- Helm v3 installed
- ArgoCD installed on the cluster

---

## Step 1: Enable Kubernetes in Docker Desktop
Settings → Kubernetes → Enable Kubernetes → Apply & Restart

## Step 2: Verify kubectl context
```bash
kubectl config use-context docker-desktop
kubectl get nodes
```

## Step 3: Install ArgoCD
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

## Step 4: Access ArgoCD UI
```bash
# Port-forward ArgoCD server
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get initial admin password
kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d
```
Open https://localhost:8080 → login with admin / <password above>

## Step 5: Build Docker images locally
```bash
cd devops-ai-tool

# Build backend
docker build -t devops-ai-backend:latest ./backend

# Build frontend
docker build -t devops-ai-frontend:latest ./frontend
```

## Step 6: Install NGINX Ingress Controller
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```

## Step 7: Add hosts to your hosts file
Add the following to `C:\Windows\System32\drivers\etc\hosts`:
```
127.0.0.1  devops-ai-frontend.local
127.0.0.1  devops-ai-backend.local
```

## Step 8: Deploy via ArgoCD

### Option A — Apply ArgoCD Application manifest (GitOps)
```bash
# Update argocd/application.yaml with your actual GitHub repo URL first
kubectl apply -f argocd/application.yaml
```

### Option B — Deploy directly with Helm (local)
```bash
helm install devops-ai-tool ./helm/devops-ai-tool \
  --namespace devops-ai \
  --create-namespace \
  --set backend.secret.openaiApiKey=<your-openai-api-key>
```

## Step 9: Verify deployment
```bash
kubectl get all -n devops-ai
kubectl get ingress -n devops-ai
```

## Step 10: Access the application
- Frontend: http://devops-ai-frontend.local
- Backend API: http://devops-ai-backend.local/health

---

## Useful Commands

```bash
# Check pod logs
kubectl logs -n devops-ai deployment/backend
kubectl logs -n devops-ai deployment/frontend

# Upgrade Helm release
helm upgrade devops-ai-tool ./helm/devops-ai-tool \
  --namespace devops-ai \
  --set backend.secret.openaiApiKey=<your-key>

# Uninstall
helm uninstall devops-ai-tool -n devops-ai
```
