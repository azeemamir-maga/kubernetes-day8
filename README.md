# Kubernetes Day 8: Volumes & Persistent Storage

A hands-on Kubernetes project demonstrating persistent storage,
PersistentVolumeClaims, and data persistence across Pod replacement.

## Technology Stack

- Kubernetes
- Minikube
- Docker
- kubectl
- PersistentVolumes (PV)
- PersistentVolumeClaims (PVC)
- StorageClasses
- BusyBox

## Practical Tasks Completed

1. Created a PVC requesting 1Gi of storage.
2. Mounted persistent storage at /data inside a Pod.
3. Created and read message.txt.
4. Deleted the original Pod.
5. Recreated the Pod using the same PVC.
6. Verified that the original data survived Pod replacement.

## Kubernetes Resources

- Pod: day8-storage-pod
- PVC: day8-storage-pvc
- StorageClass: standard
- Mount path: /data
- Requested storage: 1Gi

## Key Learning

Persistent storage can preserve application data independently of
an individual Pod's lifecycle, depending on the storage backend
and configuration.

Persistent storage does not replace backups or disaster recovery.

## Author

Azeem Aamir
DevOps Engineer | Docker | Kubernetes | Linux | Cloud Automation
