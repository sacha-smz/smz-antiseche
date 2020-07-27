/**
 * Stack
 * Structure LIFO, Last In First Out
 * On manipule seulement le sommet de la pile
 * Méthode push() pour empiler un nouvel élément
 * Méthode pop() pour retirer de la pile le dernier élément ajouté
 */

#include <stdio.h>
#include <stdlib.h>

int MAX_SIZE = 5;

typedef struct
{
  int maxSize;
  int top;
  int *data;
} stack;

int isEmpty(stack *stackPtr)
{
  return stackPtr->top == -1;
}

int isFull(stack *stackPtr)
{
  return stackPtr->top >= stackPtr->maxSize - 1;
}

int size(stack *stackPtr)
{
  return stackPtr->top + 1;
}

void push(stack *stackPtr, int val)
{
  if(isFull(stackPtr))
  {
    printf("Attempt to push in a full stack\n");
    return;
  }

  stackPtr->data[++stackPtr->top] = val;
}

int pop(stack *stackPtr)
{
  if(isEmpty(stackPtr))
  {
    printf("Attempt to pop from an empty stack\n");
    exit(EXIT_FAILURE);
  }

  return stackPtr->data[stackPtr->top--];
}

int peek(stack *stackPtr)
{
  if(isEmpty(stackPtr))
  {
    printf("Attempt to peek from an empty stack\n");
    exit(EXIT_FAILURE);
  }

  return stackPtr->data[stackPtr->top];
}

int main()
{
  stack *stackPtr = malloc(sizeof(stack));
  stackPtr->top = -1;
  stackPtr->maxSize = MAX_SIZE;
  stackPtr->data = malloc(sizeof(int) * MAX_SIZE);

  for (int i = 1; i <= MAX_SIZE; i++)
  {
    push(stackPtr, i);
    printf("%d has been added to the stack\n", i);
  }

  printf("The top element is now %d and the size of the stack is %d\n", peek(stackPtr), size(stackPtr));

  push(stackPtr, 6);

  for (int i = 0; i < MAX_SIZE; i++)
  {
    printf("%d has been removed from the stack\n", pop(stackPtr));
  }

  pop(stackPtr);
}