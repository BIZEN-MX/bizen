# 🔄 Sistema de Seguimiento de Usuarios - Setup

## ✅ Pasos Completados

1. ✅ Modelo Prisma actualizado (`prisma/schema.prisma`)
2. ✅ Prisma Client generado (`npx prisma generate`)
3. ✅ API endpoint creado (`/api/profile/stats`)
4. ✅ Endpoints de follow/unfollow creados (`/api/profile/follow`)

## 🚀 Pasos Pendientes

### 1. Ejecutar la Migración SQL en Supabase

**IMPORTANTE**: Debes ejecutar la migración SQL para crear la tabla en la base de datos.

1. Ve a tu [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **SQL Editor** en el menú lateral
4. Haz clic en **New Query**
5. Copia y pega el contenido completo de `migrations/create_user_follows_table.sql`
6. Haz clic en **Run** (o presiona Cmd+Enter / Ctrl+Enter)

### 2. Verificar que la Tabla se Creó

Después de ejecutar la migración, puedes verificar que la tabla existe:

1. En Supabase Dashboard, ve a **Table Editor**
2. Deberías ver la tabla `user_follows` en la lista
3. La tabla debe tener 3 columnas:
   - `follower_id` (TEXT)
   - `following_id` (TEXT)
   - `created_at` (TIMESTAMP)

### 3. Probar el Sistema

Una vez que la tabla esté creada, puedes probar:

1. **Ver estadísticas del perfil**: 
   - Ve a `http://localhost:3004/profile`
   - Deberías ver "Seguidores: 0" y "Siguiendo: 0" (si no has seguido a nadie aún)

2. **Probar seguir a un usuario** (desde la consola del navegador):
   ```javascript
   // Reemplaza 'USER_ID_AQUI' con el ID de otro usuario
   fetch('/api/profile/follow', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ followingId: 'USER_ID_AQUI' })
   }).then(r => r.json()).then(console.log)
   ```

3. **Verificar que los números se actualicen**:
   - Recarga la página de perfil
   - Deberías ver los números actualizados

## 📋 Endpoints Disponibles

### GET `/api/profile/stats`
Obtiene las estadísticas del usuario actual:
- `joinDate`: Fecha de registro
- `followersCount`: Número de seguidores
- `followingCount`: Número de usuarios que sigue

### POST `/api/profile/follow`
Seguir a un usuario:
```json
{
  "followingId": "user-id-aqui"
}
```

### DELETE `/api/profile/follow?followingId=xxx`
Dejar de seguir a un usuario

### GET `/api/profile/follow?userId=xxx`
Verificar si el usuario actual está siguiendo a otro usuario

## 🔍 Solución de Problemas

### Error: "Table 'user_follows' does not exist"
- **Solución**: Ejecuta la migración SQL en Supabase (paso 1)

### Error: "Cannot find module '@prisma/client'"
- **Solución**: Ejecuta `npm install` y luego `npx prisma generate`

### Los números siempre muestran 0
- **Solución**: Verifica que la tabla `user_follows` existe en Supabase y que has ejecutado la migración SQL

### Error de permisos (RLS)
- **Solución**: Verifica que las políticas RLS se crearon correctamente ejecutando las queries de verificación en la migración SQL

## 🎉 ¡Listo!

Una vez que ejecutes la migración SQL, el sistema de seguimiento estará completamente funcional y mostrará números reales de seguidores y seguidos.

