# Kubernetes Day 8 Learning Notes

## 1. Kubernetes Volumes
Provide storage that containers can access.

## 2. emptyDir
Provides temporary storage associated with a Pod.
Its data is removed when the Pod is removed.

## 3. hostPath
Mounts a file or directory from the Kubernetes node.
It requires careful security and scheduling considerations.

## 4. PersistentVolume (PV)
Represents a storage resource available to the cluster.

## 5. PersistentVolumeClaim (PVC)
Requests storage for an application.

## 6. StorageClass
Defines how storage can be provisioned dynamically.

## 7. Volume Mount
Makes a volume accessible inside a container at a specified path.

## 8. Persistence Test
Created a file, deleted the Pod, recreated it, and verified
that the original file remained available through the same PVC.

## 9. Production Considerations
Persistent storage does not automatically guarantee backups,
high availability, or disaster recovery.


## 10. emptyDir Experiment
Created /cache/message.txt inside day8-emptydir-pod. After deleting and recreating the Pod, the file was no longer present. This demonstrated that emptyDir data does not survive Pod deletion and recreation.

## 11. Storage Comparison
- emptyDir: Temporary storage tied to a Pod lifecycle.
- PVC: Requests persistent storage that can be reused by replacement Pods, subject to access modes and storage backend.
- Important: Persistent storage is not a backup. Production workloads need an appropriate backup and recovery strategy.
