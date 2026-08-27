---
name: typescript-rules
description: TypeScript performance, tsconfig, type errors, async patterns — tailored for the first-p-nestjs backend project. Triggers on .ts file work, type definitions, or when configuring TypeScript in this NestJS environment.
---
# TypeScript Best Practices (Tailored for first-p-nestjs)

This guide provides TypeScript optimization and type-safety rules specifically adapted for the **first-p-nestjs** backend project. 

## 1. Project-Specific Configuration Context
This project enforces **Strict TypeScript Mode**. AI Agent must adhere to the highest standards of type safety:
- **Strict Mode Active**: The system expects strong typing. **NEVER** use `any`. Always resolve `Implicit Any` errors by providing explicit types, Interfaces, or DTOs.
- **Strict Null Checks**: Always handle `null` and `undefined` properly using optional chaining (`?.`), nullish coalescing (`??`), or explicit `if` checks.
- **Module Resolution**: `module: "nodenext"` and `moduleResolution: "nodenext"`. Be mindful of import paths and module resolution rules in Node.js environments.
- **Decorators**: `emitDecoratorMetadata` and `experimentalDecorators` are `true` (Required for NestJS).

## 2. NestJS & TypeScript Specific Rules

### 2.1 DTO & Decorator Type Sync (CRITICAL)
In NestJS, TypeScript types are erased at runtime, but Decorators survive. 
- Ensure that class-validator decorators (`@IsString()`, `@IsOptional()`) exactly match the TypeScript type.
- Example: If a property is `name?: string`, it MUST have `@IsOptional()`.

### 2.2 Avoid `any` in New Code (HIGH)
Even though `noImplicitAny: false` is set in `tsconfig.json`:
- **Never** write new code using `any`.
- Prefer `unknown` if the type is truly dynamic, and use Type Guards to narrow it down.
- Use explicit return types for all Controller routes and Service methods.

## 3. General Type System Performance (CRITICAL)
- **Avoid Deeply Nested Generic Types**: Prevents exponential instantiation cost and compiler freezing.
- **Avoid Large Union Types**: Hardcoded union types with hundreds of strings degrade autocompletion and compiler speed.
- **Prefer Interfaces Over Type Intersections**: Interfaces (`interface A extends B`) are resolved 2-5x faster by the TS compiler than type intersections (`type A = B & C`).

## 4. Async Patterns (HIGH)
- **Annotate Async Function Return Types**: Always explicitly type what a Promise resolves to: `async getUser(): Promise<UserDto>`.
- **Avoid `await` Inside Loops**: Use `Promise.all()` for independent operations (e.g., making multiple database calls that don't depend on each other).
- **Defer `await` Until Needed**: Start the Promise early, do other synchronous work, and `await` it only when the value is actually needed.

## 5. Memory & Runtime Optimization (MEDIUM)
- **Avoid Closure Memory Leaks**: Be careful with long-lived callbacks (e.g., in WebSockets or EventEmitters) that capture large objects in their closure scope.
- **Use Set/Map for O(1) Lookups**: If you are checking for existence in an array (`array.includes()`) inside a loop, convert the array to a `Set` first.
- **Avoid Object Spread in Hot Loops**: Spreading objects `{ ...obj, newProp }` inside a `map` or `for` loop creates unnecessary intermediate objects and triggers garbage collection spikes.

## 6. How to Handle TS Errors
If you encounter a TypeScript error during development in this project:
1. Do not immediately suppress it with `@ts-ignore`.
2. Check if the error is due to `strictNullChecks`. If so, add proper truthiness checks (`if (val)`).
3. If the error is related to Prisma types, ensure `npx prisma generate` was run, as types are dynamically generated.
