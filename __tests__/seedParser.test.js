import { parse } from "../src/seedParser";



const _ = false;
const T = true;



const simpleSeed = `
. . o
o . o
o . .
`;

test('parse - no padding', () => {
	expect(parse(simpleSeed)).toStrictEqual([
		[_, _, T],
		[T, _, T],
		[T, _, _],
	]);
});

test('parse - with padding to same size', () => {
	expect(parse(simpleSeed, {
		padVerticallyTo: 3,
		padHorizontallyTo: 3,
	})).toStrictEqual([
		[_, _, T],
		[T, _, T],
		[T, _, _],
	]);
});

test('parse - with padding to square', () => {
	expect(parse(simpleSeed, {
		padVerticallyTo: 6,
		padHorizontallyTo: 6,
	})).toStrictEqual([
		[_, _, _, _, _, _],
		[_, _, _, T, _, _],
		[_, T, _, T, _, _],
		[_, T, _, _, _, _],
		[_, _, _, _, _, _],
		[_, _, _, _, _, _],
	]);
});

test('parse - with padding to non-square rectangular', () => {
	expect(parse(simpleSeed, {
		padVerticallyTo: 6,
		padHorizontallyTo: 4,
	})).toStrictEqual([
		[_, _, _, _],
		[_, _, T, _],
		[T, _, T, _],
		[T, _, _, _],
		[_, _, _, _],
		[_, _, _, _],
	]);
});

test('parse - with padding smaller than seed size', () => {
	expect(parse(simpleSeed, {
		padVerticallyTo: 1,
		padHorizontallyTo: 2,
	})).toStrictEqual([
		[_, _, T],
		[T, _, T],
		[T, _, _],
	]);
});



const zeroCharacterMultiplierSeed = `
0o . o 3.
`;

test('parse - zero character multiplier used', () => {
	expect(() => parse(zeroCharacterMultiplierSeed))
		.toThrow(new Error('Seed could not be parsed. Make sure it uses only: \'o\' or \'.\' character optionally preceded by number not starting with 0'));
});



const zeroOneCharacterMultiplierSeed = `
01. o 2.
`;

test('parse - "zero one" character multiplier used', () => {
	expect(() => parse(zeroOneCharacterMultiplierSeed))
		.toThrow(new Error('Seed could not be parsed. Make sure it uses only: \'o\' or \'.\' character optionally preceded by number not starting with 0'));
});



const unknownCharacterSeed = `
w . .
. o .
. . o
`;

test('parse - parsing error, unknown character used', () => {
	expect(() => parse(unknownCharacterSeed))
		.toThrow(new Error('Seed could not be parsed. Make sure it uses only: \'o\' or \'.\' character optionally preceded by number not starting with 0'));
});



const complexSeed = `
o
.
5. 3o
4o
7. o
2o 5. o
4. o . 2o
3. o . o 2.
`;

test('parse - no padding, character multiplication', () => {
	expect(parse(complexSeed)).toStrictEqual([
		[T, _, _, _, _, _, _, _],
		[_, _, _, _, _, _, _, _],
		[_, _, _, _, _, T, T, T],
		[T, T, T, T, _, _, _, _],
		[_, _, _, _, _, _, _, T],
		[T, T, _, _, _, _, _, T],
		[_, _, _, _, T, _, T, T],
		[_, _, _, T, _, T, _, _],
	]);
});



const performanceSeed = `
o .
.
700. 40. o 9.
75o 90. 150. o
o 500. 100o .
5.
50o 150. . 200o
`;

test('parse - performance test 750x7', () => {
	const { _, processingTimeMs } = parse(performanceSeed, {
		__test_includePerformance: true,
	});
	expect(processingTimeMs).toBeLessThan(0.5);
});

test('parse - performance test 10,000x10,000', () => {
	const { _, processingTimeMs } = parse(performanceSeed, {
		__test_includePerformance: true,
		padHorizontallyTo: 10000,
		padVerticallyTo: 10000,
	});
	expect(processingTimeMs).toBeLessThan(3000);
});
