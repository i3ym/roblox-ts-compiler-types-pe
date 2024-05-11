/// <reference no-default-lib="true"/>
/// <reference types="@rbxts/types"/>

/** Throws an error if the provided value is false or nil. */
declare function assert<T>(condition: T, message?: string): asserts condition;

/**
 * Returns the type of the given object as a string. This function works similarly to Lua’s native type function, with
 * the exceptions that Roblox-defined data types like Vector3 and CFrame return their respective data types as strings.
 */
declare function typeOf(value: any): keyof CheckableTypes;

/**
 * Returns true if `typeof(value) == type`, otherwise false.
 * This function allows for type narrowing. i.e.
 * ```
 * // v is unknown
 * if (typeIs(v, "Vector3")) {
 * 	// v is a Vector3
 * 	print(v.X, v.Y, v.Z);
 * }
 * ```
 */
declare function typeIs<T extends keyof CheckableTypes>(value: any, type: T): value is CheckableTypes[T];

/**
 * Returns true if `instance.ClassName == className`, otherwise false.
 */
declare function classIs<T extends keyof Instances>(instance: Instance, className: T): instance is Instances[T];

/**
 * Returns the passed argument. This function is a macro that compiles to just `arg`.
 *
 * This is useful for ensuring that a value matches the given type in areas where it is not directly possible to do so.
 * @example
 * type P = { x: number, y: number };
 * const obj = {
 *   pos: identity<P>({ x: 5, y: 10 });
 * }
 */
declare function identity<T>(arg: T): T;

/**
 * **Only valid as the expression of a for-of loop!**
 *
 * Used to compile directly to normal Lua numeric for loops. For example,
 * ```ts
 * for (const i of $range(1, 10)) {
 * 	print(i);
 * }
 * ```
 * will compile into
 * ```lua
 * for i = 1, 10 do
 * 	print(i)
 * end
 * ```
 *
 * The `step` argument controls the amount incremented per loop. It defaults to `1`.
 */
declare function $range(start: number, finish: number, step?: number): Iterable<number>;

/**
 * **Only valid as the expression of a return statement!**
 *
 * Compiles directly to a multiple return in Lua. For example,
 * ```ts
 * return $tuple(123, "abc", true);
 * ```
 * will compile into
 * ```lua
 * return 123, "abc", true
 * ```
 */
declare function $tuple<T extends Array<any>>(...values: T): LuaTuple<T>;

/**
 * Provides the instance tree representation to `path` at runtime.
 *
 * ```ts
 * $getModuleTree("@rbxts/services");
 * ```
 * will, assuming the default rojo game project, compile into
 * ```lua
 * { game:GetService("ReplicatedStorage"), { "rbxts_include", "node_modules", "@rbxts", "services" } }
 * ```
 */
declare function $getModuleTree(module: string): [root: Instance, parts: Array<string>];

/**
 * Returns the time at which this file was compiled, in unix timestamp.
 */
declare function $compileTime(): number;

// Explanation for the next methods
/* In lua:
`Record<K, V>` (any object) is represented as a table with keys K and values V
`Map<K, V>` is represented exactly the same as Record<K, V>
`Set<V>` is represented as a table with keys V and values `true`
`V[]` is represented as a table with keys `number` and values V

Or, simpler,
`Map<K, V>` = `Record<K, V>`
`Set<V>` = `Record<V, true>`
`V[]` = `Record<number, V>`

So we can safely (excluding the 1-based array indexing shenanigans) convert between them to use methods from other types
*/

declare function asObject<V>(map: ReadonlyArray<V>): object & Readonly<Record<number, V>>;
declare function asObject<V>(map: Array<V>): object & Record<number, V>;

declare function asObject<V extends string | number | symbol>(map: Set<V>): object & Record<V, true>;
declare function asObject<V extends string | number | symbol>(map: ReadonlySet<V>): object & Readonly<Record<V, true>>;

declare function asObject<K extends string | number | symbol, V>(map: Map<K, V>): object & Record<K, V>;
declare function asObject<K extends string | number | symbol, V>(
	map: ReadonlyMap<K, V>,
): object & Readonly<Record<K, V>>;

declare function asObject<K extends string | number | symbol, V>(
	map: ReadonlyMap<K, V> | ReadonlySet<V> | ReadonlyArray<V>,
): object & Record<K, V>;

declare function asMap<V>(object: Array<V>): Map<number, V & defined>;
declare function asMap<V>(object: ReadonlyArray<V>): ReadonlyMap<number, V & defined>;

declare function asMap<V extends defined>(object: Set<V>): Map<V, true>;
declare function asMap<V extends defined>(object: ReadonlySet<V>): ReadonlyMap<V, true>;

declare function asMap<T extends object>(object: T): Map<keyof T, T[keyof T] & defined>;
declare function asMap<T extends object>(object: T): ReadonlyMap<keyof T, T[keyof T] & defined>;

declare function asMap<K extends string | number | symbol, V>(
	object: (object & Readonly<Record<K, V>>) | ReadonlySet<V> | ReadonlyArray<V>,
): Map<K, V>;

//

declare function asSet(object: Array<true>): Set<number>;
declare function asSet(object: ReadonlyArray<true>): ReadonlySet<number>;

declare function asSet<K extends defined>(object: Map<K, true>): Set<K>;
declare function asSet<K extends defined>(object: ReadonlyMap<K, true>): ReadonlySet<K>;

declare function asSet<K extends string | number | symbol>(object: object & Record<K, true>): Set<K>;
declare function asSet<K extends string | number | symbol>(object: object & Readonly<Record<K, true>>): ReadonlySet<K>;

declare function asSet<K extends string | number | symbol>(
	object: (object & Readonly<Record<K, true>>) | ReadonlyMap<K, true> | ReadonlyArray<true>,
): Set<K>;

//

declare function asArray(object: Set<number>): Array<true>;
declare function asArray(object: ReadonlySet<number>): ReadonlyArray<true>;

declare function asArray<V>(object: Map<number, V>): Array<V>;
declare function asArray<V>(object: ReadonlyMap<number, V>): ReadonlyArray<V>;

declare function asArray<V>(object: object & Record<number, V>): Array<V>;
declare function asArray<V>(object: object & Readonly<Record<number, V>>): ReadonlyArray<V>;

declare function asArray<K extends string | number | symbol, V>(
	object: (object & Readonly<Record<K, V>>) | ReadonlyMap<K, V> | ReadonlySet<V>,
): Array<V>;
