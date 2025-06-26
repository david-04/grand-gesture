define HELP

	begin ..... start translation (alias: begin-translation)
	end ....... finish translation (alias: end-translation)
	format .... format the code
	release ... assemble the release

endef

$(call dc.lint, biome format --write)

autorun format: lint;

begin begin-translation :
	tsx bin/locales.ts begin-translation

end end-translation :
	tsx bin/locales.ts end-translation

release:
	. bin/assemble-release.sh
