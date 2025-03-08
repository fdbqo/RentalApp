module.exports = {
  expo: {
    name: "RentalApp",
    slug: "RentalApp",
    version: "1.0.0",
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: "com.RentalApp.PR300",
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      package: "com.RentalApp.PR300",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "eda71aae-415d-4581-b0c0-a071913aa42e"
      }
    }
  }
} 