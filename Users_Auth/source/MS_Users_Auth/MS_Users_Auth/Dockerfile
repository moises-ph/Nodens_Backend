#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["MS_Users_Auth/MS_Users_Auth.csproj", "MS_Users_Auth/"]
RUN dotnet restore "MS_Users_Auth/MS_Users_Auth.csproj"
COPY . .
WORKDIR "/src/MS_Users_Auth"
RUN dotnet build "MS_Users_Auth.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MS_Users_Auth.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MS_Users_Auth.dll"]