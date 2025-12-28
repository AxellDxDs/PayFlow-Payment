"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/lib/i18n/language-context"
import { type Language, languageNames, languageFlags } from "@/lib/i18n/translations"
import { Globe, Check } from "@/components/icons"
import { cn } from "@/lib/utils"

interface LanguageSelectorProps {
  trigger?: React.ReactNode
  showFlag?: boolean
}

export function LanguageSelector({ trigger, showFlag = true }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage()
  const [open, setOpen] = React.useState(false)

  const languages: Language[] = [
    "id",
    "en",
    "ar",
    "zh",
    "ja",
    "ko",
    "ms",
    "th",
    "vi",
    "hi",
    "fr",
    "de",
    "es",
    "pt",
    "ru",
    "tr",
  ]

  const handleSelectLanguage = React.useCallback(
    (lang: Language) => {
      setLanguage(lang)
      setOpen(false)
    },
    [setLanguage],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="relative">
            <Globe className="h-5 w-5" />
            {showFlag && <span className="absolute -bottom-0.5 -right-0.5 text-xs">{languageFlags[language]}</span>}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t.settings.language}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 gap-2">
            {languages.map((lang) => (
              <Button
                key={lang}
                type="button"
                variant={language === lang ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-auto py-3",
                  language === lang && "bg-primary text-primary-foreground",
                )}
                onClick={() => handleSelectLanguage(lang)}
              >
                <span className="text-xl">{languageFlags[lang]}</span>
                <span className="flex-1 text-left">{languageNames[lang]}</span>
                {language === lang && <Check className="h-4 w-4" />}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
