use master;
drop database if exists AuthServiceDB;
create database AuthServiceDB;
use AuthServiceDB;

create table Role(
	id int primary key identity(1,1),
	name varchar(50) not null
);


create table Users(
	id int primary key identity(1,1),
	email varchar(320) unique not null,
	password varchar(max) not null,
	userName varchar(100) unique not null,
	created_at date not null,
	updated_at date,
	Verified bit not null default 0,
	role_id int not null,
	constraint fk_role_1 foreign key (role_id) references Role(id)
);



create table Permission(
	id int primary key identity(1,1),
	name varchar(100) not null,
	description varchar(500) not null
);

create table RolePermissions(	
	role_id int not null,
	permission_id int not null,
	constraint fk_role_2 foreign key (role_id) references Role(id),
	constraint fk_permission foreign key (permission_id) references Permission(id)
);

--------------------------------------------------------------------------------------------------------

INSERT into Role(name) values ('Musician'),('Organizer')

--------------------------------------------------------------------------------------------------------

go
create procedure SP_CreateUser
	@Email varchar(320),
	@userName varchar(100),
	@Password varchar(max),
	@Role varchar(50)
as
begin transaction TX_New_User
	BEGIN TRY
		if @Role = 'Musician' or @Role = 'Organizer'
		begin
			INSERT INTO Users(email,password, userName, created_at, role_id)
			values (@Email, @Password, @userName,GETDATE(), (select id from Role where name = @Role))

			COMMIT TRANSACTION TX_New_User
			SELECT 'Usuario Creado Correctamente' as Message, 0 as Error
		end
		else select 'Roles invalidos' as Message, 1 as Error
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION TX_New_User
		SELECT ERROR_MESSAGE() as Message, 1 as Error
	END CATCH
go
---------------------------------

go
create procedure SP_ReadUser
	@Email varchar(320) = NULL,
	@username varchar(100) = NULL,
	@Id int = NULL
as
begin
	SELECT userName, (select name from Role where id = role_id) as Role, email, Verified from Users where email = @Email or userName = @username or id = @Id
end
go

---------------------------------

go
create procedure SP_AuthUser
	@Email varchar(320)
as
begin
	if exists(SELECT id from Users where email = @Email)
		SELECT Users.password as 'password', Users.Verified as 'Verified', Users.id as 'id', Users.userName as 'userName', Role.name as 'Role' from Users inner join Role on Users.role_id = Role.id where email = @Email 
	else
		SELECT null as password, null as Verified, null as Role
end
go

-----------------------

go
create procedure SP_VerifyUser
	@Email varchar(320)
as
begin transaction TX_VerifyUser
	BEGIN TRY
		UPDATE Users set Verified = 1, updated_at = GETDATE() where email = @Email
		COMMIT TRANSACTION TX_VerifyUser
		SELECT 'Usuario verificado correctamente' as Message, 0 as Error
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION TX_VerifyUser
		SELECT ERROR_MESSAGE() as Message, 1 as Error
	END CATCH
go
-----------------------

go
create procedure SP_ChangePassword
	@Email varchar(320),
	@NewPass varchar(max)
as
begin transaction TX_ChangePassword
	BEGIN TRY
		UPDATE Users set password = @NewPass, updated_at = GETDATE() where email = @Email
		COMMIT TRANSACTION TX_ChangePassword
		SELECT 'Contraseņa actualizada correctamente' as Message, 0 as Error
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION TX_ChangePassword
		SELECT ERROR_MESSAGE() as Message, 1 as Eror
	END CATCH
go

----------------------

go 
create procedure SP_DeleteUser
	@Email varchar(320)
as
begin transaction TX_DeleteUser
	BEGIN TRY	
		declare @id int
		SELECT @id = id from Users where email = @Email
		
		DELETE FROM Users where id = @id
		COMMIT TRANSACTION TX_DeleteUser
		SELECT 'Usuario eliminado correctamente' as Message, 0 as Error
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION TX_DeleteUser
		SELECT ERROR_MESSAGE() as Message, 1 as Eror
	END CATCH
go

-------------------

go
create procedure SP_UpdateUser
	@Email varchar(320),
	@newEmail varchar(320),
	@userName varchar(100)
as
begin transaction TX_Update_User
	BEGIN TRY
			update Users set 
				userName = ISNULL(@userName, userName),
				updated_at = GETDATE()
			where email = @Email
			if (@newEmail != @Email) begin 
				update Users set Verified = 0, email = @newEmail where email = @Email 
			end
			COMMIT TRANSACTION TX_Update_User
			SELECT 'Usuario actualizado correctamente' as Message, 0 as Error
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION TX_Update_User
		SELECT ERROR_MESSAGE() as Message, 1 as Error
	END CATCH
go
------------------