module.exports = {
  expo: {
    name: "RentalApp",
    slug: "RentalApp",
    version: "1.0.5",
    icon: "./assets/images/icon.png",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: "com.RentalApp.PR300",
      supportsTablet: true,
      icon: "./assets/images/icon.png",
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
        projectId: "58aeca61-2cd2-4e96-8663-97a4d7e2300d"
      }
    }
  }
} 