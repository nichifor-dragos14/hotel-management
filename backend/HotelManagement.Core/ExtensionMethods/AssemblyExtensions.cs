namespace System.Reflection;

public static class AssemblyExtensions
{
    public static IEnumerable<(Type Generic, Type Implementation)> GetGenericTypeImplementationsOf(
        this Assembly assembly, params Type[] markers)
    {
        if (markers.Count() == 0) throw new ArgumentException("At least one marker must be provided!", nameof(markers));

        if (markers.Any(marker => !marker.IsGenericType || !marker.IsGenericTypeDefinition))
            throw new ArgumentException("Cannot use non open generic types as a marker!", nameof(markers));

        if (markers.Any(marker => !marker.IsInterface))
            throw new ArgumentException("Cannot use non interface as a marker!", nameof(markers));

        Type FindGenericType(Type type, Type marker)
        {
            return type.GetInterfaces().FirstOrDefault(i => i.IsGenericType && i.GetGenericTypeDefinition() == marker);
        }

        return assembly
            .GetTypes()
            .Where(type => !type.IsAbstract && !type.IsInterface)
            .SelectMany(
                type => markers.Select(
                    marker => (
                        Generic: FindGenericType(type, marker),
                        Implementation: type
                    )
                )
            )
            .Where(tuple => tuple.Generic != null); 
    }
}