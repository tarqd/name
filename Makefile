dist/name.js:
	@component build -s Name -o dist -n name

dist/name.min.js: dist/name.js
	@uglifyjs dist/name.js -o dist/name.min.js -m

standalone: dist/name.js
min: dist/name.min.js


build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js dist

.PHONY: clean
