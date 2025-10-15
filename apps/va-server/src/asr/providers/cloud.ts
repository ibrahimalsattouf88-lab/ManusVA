const config = speechSdk.SpeechConfig.fromSubscription(process.env.AZURE_SPEECH_KEY!, process.env.AZURE_SPEECH_REGION!);
config.speechRecognitionLanguage = "ar-SY";
// تحسينات مقترحة:
config.setProperty("SpeechServiceResponse_PostProcessingOption", "TrueText"); // ترقيم & تحسين صياغة
config.setServiceProperty("wordLevelTimestampsEnabled", "true", speechSdk.ServicePropertyChannel.UriQueryParameter);
