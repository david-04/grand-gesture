include .launchpad/Makefile.header # see .launchpad/Makefile.documentation
#-----------------------------------------------------------------------------------------------------------------------

autorun: ;

$(call lp.help.add-phony-target, begin, .............. start a translation)
begin begin-translation :
	tsx bin/locales.ts begin-translation

$(call lp.help.add-phony-target, end, ................ end the translation)
end end-translation :
	tsx bin/locales.ts end-translation

$(call lp.help.add-phony-target , release, ............ zip a release)
release:
	. bin/assemble-release.sh

$(call lp.tsc.disable)

#-----------------------------------------------------------------------------------------------------------------------
include .launchpad/Makefile.footer
