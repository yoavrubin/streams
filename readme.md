# Streams.js #

Showing the idea of lazy generators. 
A generator is something that has the field *first* and a method *rest*

From these, all the rest is created.

In adhocMakers.js there are now three simple generators:

-  intGen :  generates natural numbers 

- factorialGenerator : generates a stream of the factorials

- cachingFactorialStream : generates a stream of factorials, but each element in the stream is calculated only once



In combinators.js there are functions that operate on streams

In generators.js there are functions that take non stream elements and produce streams out of it