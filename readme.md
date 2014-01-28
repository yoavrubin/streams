# Streams.js #

Showing the idea of lazy generators. 
A generator is something that has the field *first* and a method *rest*

From these, all the rest is created.

For now added two simple generators:

-  intGen :  generates natural numbers 

- factorialGenerator : generates a stream of the factorials

- cachingFactorialStream : generates a stream of factorials, but each element in the stream is calculated only once

There are several functions that operate on generators, taking, droping, mapping and filtering 