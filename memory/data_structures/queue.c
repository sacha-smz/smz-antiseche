/**
 * Queue
 * Structure LIFO, Last In First Out
 * On retire les éléments dans leur ordre d'arrivée
 * Méthode enqueue() pour ajouter un élément à la fin de la queue
 * Méthode dequeue() pour retirer un élément en début de queue
 */

#include <stdio.h>
#include <stdlib.h>

int MAX_SIZE = 5;

typedef struct
{
  int maxSize;
  int rear; // indice de la dernière insertion
  int front; // indice du prochain retrait
  int size;
  int *data;
} queue;

int isEmpty(queue *queuePtr)
{
  return queuePtr->size <= 0;
}

int isFull(queue *queuePtr)
{
  return queuePtr->size >= queuePtr->maxSize;
}

void enqueue(queue *queuePtr, int val)
{
  if(isFull(queuePtr))
  {
    printf("Attempt to enqueue in a full queue\n");
    return;
  }

  queuePtr->rear = (queuePtr->rear + 1) % queuePtr->maxSize;
  queuePtr->data[queuePtr->rear] = val;
  queuePtr->size++;
}

int dequeue(queue *queuePtr)
{
  if(isEmpty(queuePtr))
  {
    printf("Attempt to dequeue from an empty queue\n");
    exit(EXIT_FAILURE);
  }

  int val = queuePtr->data[queuePtr->front];
  queuePtr->front = (queuePtr->front + 1) % queuePtr->maxSize;
  queuePtr->size--;
  return val;
}

int rear(queue *queuePtr)
{
  if(isEmpty(queuePtr))
  {
    printf("Attempt to access the rear of an empty queue\n");
    exit(EXIT_FAILURE);
  }

  return queuePtr->data[queuePtr->rear];
}

int front(queue *queuePtr)
{
  if(isEmpty(queuePtr))
  {
    printf("Attempt to access the front of an empty queue\n");
    exit(EXIT_FAILURE);
  }

  return queuePtr->data[queuePtr->front];
}

int main()
{
  queue *queuePtr = malloc(sizeof(queue));
  queuePtr->rear = -1;
  queuePtr->front = 0;
  queuePtr->size = 0;
  queuePtr->maxSize = MAX_SIZE;
  queuePtr->data = malloc(sizeof(int) * MAX_SIZE);

  for (int i = 1; i <= MAX_SIZE; i++)
  {
    enqueue(queuePtr, i);
    printf("%d has been added to the queue\n", i);
  }

  printf("The first element in the queue is %d and the last element is %d\nThe size of the queue is %d\n", front(queuePtr), rear(queuePtr), queuePtr->size);

  enqueue(queuePtr, 6);

  for (int i = 0; i < MAX_SIZE; i++)
  {
    printf("%d has been removed from the queue\n", dequeue(queuePtr));
  }

  dequeue(queuePtr);
}