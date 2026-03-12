# Alarma Mobile

App móvil de alarmas desarrollada con HTML/CSS/JS y empaquetada para Android con Capacitor.

## Requisitos

- [Node.js](https://nodejs.org) v18+
- [Android Studio](https://developer.android.com/studio) con Android SDK instalado
- Java JDK 11+

## Instalación y configuración

```powershell
# 1. Clonar el repositorio
git clone https://github.com/npaezt/alarma-mobile
cd alarma-mobile

# 2. Instalar dependencias
npm install

# 3. Preparar carpeta web
New-Item -ItemType Directory -Force -Path www
Copy-Item index.html www\; Copy-Item -Recurse -Force css www\; Copy-Item -Recurse -Force js www\

# 4. Agregar plataforma Android y sincronizar
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
npx cap add android
npx cap sync android
```

## Correr en Android

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
npx cap run android
```

O abrir en Android Studio:

```powershell
npx cap open android
```

Luego en Android Studio: **Run → Run 'app'**

## Generar APK

```powershell
cd android
.\gradlew.bat assembleDebug
```

El APK queda en: `android/app/build/outputs/apk/debug/app-debug.apk`

## Flujo de desarrollo

```powershell
# 1. Editar archivos en VS Code (index.html, css/, js/)

# 2. Sincronizar cambios con Android
Copy-Item index.html www\; Copy-Item -Recurse -Force css www\; Copy-Item -Recurse -Force js www\
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
npx cap sync android

# 3. Correr o generar APK
npx cap run android
```

## Estructura del proyecto

```
alarma-mobile/
├── index.html          # Estructura de pantallas
├── css/
│   ├── styles.css      # Estilos base y layout
│   └── components.css  # Componentes UI
├── js/
│   └── app.js          # Lógica y navegación
├── capacitor.config.ts # Configuración de Capacitor
└── package.json
```
