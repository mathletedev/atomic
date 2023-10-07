{
  inputs = {
    nixpkgs.url = "nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          system = system;
          config = {
            allowUnfree = true;
            android_sdk.accept_license = true;
          };
        };

        android = pkgs.androidenv.composeAndroidPackages {
          buildToolsVersions = [ "33.0.0" ];
          platformVersions = [ "33" ];
          abiVersions = [ "x86" "x86_64" ];
        };
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            android.androidsdk
            android.build-tools
            jdk11
          ];

          shellHook =
            ''
              export ANDROID_HOME=${android.androidsdk}/libexec/android-sdk
              export GRADLE_OPTS="-Dorg.gradle.project.android.aapt2FromMavenOverride=${android.androidsdk}/libexec/android-sdk/build-tools/33.0.0/aapt2"
              exec fish
            '';
        };
      });
}
